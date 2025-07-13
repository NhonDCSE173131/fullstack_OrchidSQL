package com.orchids.pojo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "orchids")
@Getter
@Setter
public class Orchid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orchidId;

    @Column(name = "is_natural")
    private Boolean isNatural;

    @Column(name = "orchid_description")
    private String orchidDescription;

    @Column(name = "orchid_name")
    private String orchidName;

    @Column(name = "orchid_url", length = 2048)
    private String orchidUrl;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "status")
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "orchid")
    private List<OrderDetail> orderDetails;
}