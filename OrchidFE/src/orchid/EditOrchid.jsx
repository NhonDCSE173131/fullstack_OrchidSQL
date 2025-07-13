import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Button, Col, Form, FormGroup, Image, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router';
import { getAuthHeaders } from '../utils/authUtils.js';

export default function EditOrchid() {
  const baseUrl = 'http://localhost:8080/api/orchids';
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm();

  useEffect(() => {
    axios.get(`${baseUrl}/${id}`, { headers: getAuthHeaders() })
      .then((response) => {
        setAPI(response.data);
        setValue('orchidName', response.data.orchidName);
        setValue('orchidDescription', response.data.orchidDescription);
        setValue('price', response.data.price);
        setValue('isNatural', response.data.isNatural);
        setValue('categoryId', response.data.categoryId);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch orchid data.');
      });
  }, [id, setValue, baseUrl]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('orchidName', data.orchidName);
    formData.append('orchidDescription', data.orchidDescription);
    formData.append('price', data.price);
    formData.append('isNatural', data.isNatural || false);
    formData.append('categoryId', data.categoryId);
    if (selectedFile) {
      formData.append('orchidUrl', selectedFile);
    } else if (api.orchidUrl) {
      // If no new file, backend may require a file, so this may need to be handled server-side
      // Optionally, you can skip or send a placeholder
    }
    axios.put(`${baseUrl}/${id}`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        toast.success('Orchid edited successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to edit orchid.');
      });
  };

  return (
    <Container className="py-5">
      <Toaster />
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow rounded custom-card p-4">
            <Card.Body>
              <h2 className="text-primary mb-4">Edit Orchid</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Name</Form.Label>
                  <Controller
                    name="orchidName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Form.Control {...field} type="text" className="shadow-sm" />}
                  />
                  {errors.orchidName && errors.orchidName.type === "required" && <p className="text-warning">Name is required</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="orchidDescription">
                  <Form.Label>Description</Form.Label>
                  <Controller
                    name="orchidDescription"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Form.Control {...field} as="textarea" rows={3} className="shadow-sm" />}
                  />
                  {errors.orchidDescription && errors.orchidDescription.type === "required" && <p className="text-warning">Description is required</p>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Controller
                    name="price"
                    control={control}
                    rules={{ required: true, min: 0.01 }}
                    render={({ field }) => <Form.Control {...field} type="number" min="0.01" step="0.01" className="shadow-sm" />}
                  />
                  {errors.price && <p className="text-warning">Valid price is required</p>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="categoryId">
                  <Form.Label>Category ID</Form.Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => <Form.Control {...field} type="number" min="1" className="shadow-sm" />}
                  />
                  {errors.categoryId && <p className="text-warning">Category ID is required</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} className="shadow-sm" />
                  {api.orchidUrl && !selectedFile && (
                    <div className="mt-2"><span className="text-muted">Current image: </span><a href={api.orchidUrl} target="_blank" rel="noopener noreferrer">View</a></div>
                  )}
                </Form.Group>

                <FormGroup className="mb-3">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Natural"
                    {...register("isNatural")}
                  />
                </FormGroup>

                <Button variant="primary" type="submit" className="w-100 py-2">
                  Save
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="d-none d-md-block">
          <Image src={api.orchidUrl} width={240} thumbnail className='shadow-lg p-3 mb-5 bg-body-tertiary rounded custom-image' />
        </Col>
      </Row>
    </Container>
  );
}
