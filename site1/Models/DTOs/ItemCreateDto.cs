using System.ComponentModel.DataAnnotations;

namespace MessageApi.Models.DTOs
{
    /// <summary>
    /// DTO para crear un nuevo item
    /// </summary>
    public class ItemCreateDto
    {
        /// <summary>
        /// Nombre del item
        /// </summary>
        [Required(ErrorMessage = "El nombre del item es requerido")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres")]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Precio del item
        /// </summary>
        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Price { get; set; }

        /// <summary>
        /// ID del usuario que crea el item
        /// </summary>
        public int CreatedBy { get; set; } = 1; // Usuario por defecto
    }
}
