using AutoMapper;
using MessageApi.Models;
using MessageApi.Models.DTOs;
using MessageApi.Repositories;
using Microsoft.Extensions.Logging;

namespace MessageApi.Services
{
    /// <summary>
    /// Servicio para la gestión de items
    /// </summary>
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;
        private readonly ILogger<ItemService> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Constructor del servicio de items
        /// </summary>
        public ItemService(
            IItemRepository itemRepository,
            ILogger<ItemService> logger,
            IMapper mapper)
        {
            _itemRepository = itemRepository ?? throw new ArgumentNullException(nameof(itemRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Obtiene todos los items
        /// </summary>
        public async Task<IEnumerable<ItemReadDto>> GetAllItemsAsync()
        {
            _logger.LogInformation("Obteniendo todos los items desde el servicio");
            var items = await _itemRepository.GetAllItemsAsync();
            return _mapper.Map<IEnumerable<ItemReadDto>>(items);
        }

        /// <summary>
        /// Obtiene un item por su ID
        /// </summary>
        public async Task<ItemReadDto?> GetItemByIdAsync(int id)
        {
            _logger.LogInformation($"Obteniendo item con ID: {id}");
            var item = await _itemRepository.GetItemByIdAsync(id);
            return item != null ? _mapper.Map<ItemReadDto>(item) : null;
        }

        /// <summary>
        /// Crea un nuevo item
        /// </summary>
        public async Task<ItemReadDto> CreateItemAsync(ItemCreateDto itemDto)
        {
            _logger.LogInformation("Creando nuevo item");
            var item = _mapper.Map<Item>(itemDto);
            var createdItem = await _itemRepository.CreateItemAsync(item);
            return _mapper.Map<ItemReadDto>(createdItem);
        }

        /// <summary>
        /// Actualiza un item existente
        /// </summary>
        public async Task<bool> UpdateItemAsync(int id, ItemCreateDto itemDto)
        {
            _logger.LogInformation($"Actualizando item con ID: {id}");
            var existingItem = await _itemRepository.GetItemByIdAsync(id);
            if (existingItem == null)
            {
                return false;
            }

            _mapper.Map(itemDto, existingItem);
            return await _itemRepository.UpdateItemAsync(existingItem);
        }

        /// <summary>
        /// Elimina un item
        /// </summary>
        public async Task<bool> DeleteItemAsync(int id)
        {
            _logger.LogInformation($"Eliminando item con ID: {id}");
            return await _itemRepository.DeleteItemAsync(id);
        }
    }
}
