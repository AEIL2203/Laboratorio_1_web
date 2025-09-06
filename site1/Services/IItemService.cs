using MessageApi.Models.DTOs;

namespace MessageApi.Services
{
    /// <summary>
    /// Interfaz para el servicio de gestión de items
    /// </summary>
    public interface IItemService
    {
        /// <summary>
        /// Obtiene todos los items
        /// </summary>
        /// <returns>Lista de items</returns>
        Task<IEnumerable<ItemReadDto>> GetAllItemsAsync();

        /// <summary>
        /// Obtiene un item por su ID
        /// </summary>
        /// <param name="id">ID del item</param>
        /// <returns>Item encontrado o null</returns>
        Task<ItemReadDto?> GetItemByIdAsync(int id);

        /// <summary>
        /// Crea un nuevo item
        /// </summary>
        /// <param name="itemDto">Datos del item a crear</param>
        /// <returns>Item creado</returns>
        Task<ItemReadDto> CreateItemAsync(ItemCreateDto itemDto);

        /// <summary>
        /// Actualiza un item existente
        /// </summary>
        /// <param name="id">ID del item a actualizar</param>
        /// <param name="itemDto">Nuevos datos del item</param>
        /// <returns>True si se actualizó correctamente</returns>
        Task<bool> UpdateItemAsync(int id, ItemCreateDto itemDto);

        /// <summary>
        /// Elimina un item
        /// </summary>
        /// <param name="id">ID del item a eliminar</param>
        /// <returns>True si se eliminó correctamente</returns>
        Task<bool> DeleteItemAsync(int id);
    }
}
