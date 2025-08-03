export function transformFormData(category, formData) {
  switch (category) {
    // User category data transformation
    case "users":
      return {
        // Default data fields
        username: formData.username || "",
        password: formData.password || "",
        first_name: formData.first_name || "",
        last_name: formData.last_name || "",
        email: formData.email || "",
        is_staff: !!formData.is_staff,
      };
  }
}
