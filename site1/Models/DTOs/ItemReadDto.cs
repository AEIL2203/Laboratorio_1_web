namespace MessageApi.Models.DTOs
{
    /// <summary>
    /// DTO para leer un item existente
    /// </summary>
    public class ItemReadDto
    {
        /// <summary>
        /// ID único del item
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Nombre del item
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Precio del item
        /// </summary>
        public decimal Price { get; set; }

        /// <summary>
        /// ID del usuario que creó el item
        /// </summary>
        public int CreatedBy { get; set; }

        /// <summary>
        /// Fecha de creación del item
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// ID del usuario que actualizó el item
        /// </summary>
        public int UpdatedBy { get; set; }

        /// <summary>
        /// Fecha de última actualización del item
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
    }
}
