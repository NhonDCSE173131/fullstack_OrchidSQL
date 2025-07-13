package com.orchids.minio;


import com.orchids.config.MinioProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MinioService {

    private final MinioProperties properties;
    private S3Client s3Client;
    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        log.info("Initializing MinIO service with endpoint: {}, bucket: {}",
                properties.getEndpoint(), properties.getBucket());

        // Force path-style access which works better with MinIO
        S3Configuration s3Configuration = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();

        this.s3Client = S3Client.builder()
                .region(Region.of(properties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(properties.getAccessKey(), properties.getSecretKey())))
                .endpointOverride(URI.create(properties.getEndpoint()))
                .serviceConfiguration(s3Configuration)
                .build();

        this.presigner = S3Presigner.builder()
                .region(Region.of(properties.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(properties.getAccessKey(), properties.getSecretKey())))
                .endpointOverride(URI.create(properties.getEndpoint()))
                .serviceConfiguration(s3Configuration)
                .build();

        createBucketIfNotExist();
    }

    public void createBucketIfNotExist() {
        try {
            // First check if bucket exists using headBucket
            HeadBucketRequest headBucketRequest = HeadBucketRequest.builder()
                    .bucket(properties.getBucket())
                    .build();

            try {
                s3Client.headBucket(headBucketRequest);
                log.info("Bucket {} already exists", properties.getBucket());
            } catch (NoSuchBucketException e) {
                log.info("Bucket {} does not exist, creating it", properties.getBucket());
                // Create bucket with minimal configuration - works better with MinIO
                s3Client.createBucket(CreateBucketRequest.builder()
                        .bucket(properties.getBucket())
                        .build());
                log.info("Bucket {} created successfully", properties.getBucket());
            }
        } catch (S3Exception e) {
            log.error("Error with S3/MinIO: {} - {}", e.getMessage(), e.awsErrorDetails().errorMessage(), e);
            throw e;
        }
    }

    public String uploadFileAndGetPresignedUrl(MultipartFile file) {
        return uploadFileAndGetPresignedUrl(file, Duration.ofDays(7));
    }

    public String uploadFileAndGetPresignedUrl(MultipartFile file, Duration duration) {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        try {
            log.info("Uploading file {} to bucket {}", fileName, properties.getBucket());

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            log.info("File uploaded successfully");

            // Presigned URL
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(properties.getBucket())
                    .key(fileName)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(duration)
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = presigner.presignGetObject(presignRequest);
            String url = presignedRequest.url().toString();
            log.info("Generated presigned URL: {}", url);
            return url;

        } catch (S3Exception e) {
            log.error("S3 error during file upload: {} - {}", e.getMessage(), e.awsErrorDetails().errorMessage(), e);
            throw new RuntimeException("Failed to upload file to MinIO", e);
        } catch (IOException e) {
            log.error("IO error during file upload: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to MinIO", e);
        }
    }
}
