package com.orchids.Category;

import com.orchids.dto.CategoryRequest;
import com.orchids.dto.CategoryResponse;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(Long categoryId, CategoryRequest request);
    void deleteCategory(Long categoryId);
    CategoryResponse getCategoryById(Long categoryId);
    List<CategoryResponse> getAllCategories();
}