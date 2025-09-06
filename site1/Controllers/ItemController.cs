using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using MessageApi.Models.DTOs;
using MessageApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace HelloApi.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones CRUD de items.
    /// Proporciona endpoints para crear, leer, actualizar y eliminar items.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;
        private readonly ILogger<ItemController> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Inicializa una nueva instancia del controlador de items.
        /// </summary>
        public ItemController(
            IItemService itemService,
            ILogger<ItemController> logger,
            IMapper mapper)
        {
            _itemService = itemService ?? throw new ArgumentNullException(nameof(itemService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Obtiene todos los items existentes en el sistema.
        /// </summary>
        /// <returns>Una lista de todos los items.</returns>
        /// <response code="200">Retorna la lista de items.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ItemReadDto>>> GetAllItems()
        {
            try
            {
                _logger.LogInformation("Obteniendo todos los items");
                var items = await _itemService.GetAllItemsAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los items");
                return StatusCode(500, "Error interno del servidor al obtener los items");
            }
        }

        /// <summary>
        /// Obtiene un item específico por su ID.
        /// </summary>
        /// <param name="id">ID del item a buscar.</param>
        /// <returns>El item solicitado o NotFound si no existe.</returns>
        /// <response code="200">Retorna el item solicitado.</response>
        /// <response code="404">No se encontró el item con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet("{id}", Name = "GetItemById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ItemReadDto>> GetItemById(int id)
        {
            try
            {
                _logger.LogInformation($"Buscando item con ID: {id}");
                var item = await _itemService.GetItemByIdAsync(id);
                if (item == null)
                {
                    _logger.LogWarning($"No se encontró el item con ID: {id}");
                    return NotFound();
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener el item con ID {id}");
                return StatusCode(500, "Error interno del servidor al obtener el item");
            }
        }

        /// <summary>
        /// Crea un nuevo item en el sistema.
        /// </summary>
        /// <param name="itemDto">DTO con los datos del item a crear.</param>
        /// <returns>El item recién creado con su ID asignado.</returns>
        /// <response code="201">Retorna el item creado.</response>
        /// <response code="400">Los datos del item no son válidos.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ItemReadDto>> CreateItem([FromBody] ItemCreateDto itemDto)
        {
            try
            {
                _logger.LogInformation("Iniciando creación de nuevo item");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de item no válidos. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var item = await _itemService.CreateItemAsync(itemDto);
                _logger.LogInformation($"Item creado exitosamente con ID: {item.Id}");
                
                return CreatedAtRoute(nameof(GetItemById), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el item");
                return StatusCode(500, "Error interno del servidor al crear el item");
            }
        }

        /// <summary>
        /// Actualiza un item existente.
        /// </summary>
        /// <param name="id">ID del item a actualizar.</param>
        /// <param name="itemDto">DTO con los nuevos datos del item.</param>
        /// <returns>NoContent si la actualización fue exitosa, o NotFound si el item no existe.</returns>
        /// <response code="204">El item se actualizó correctamente.</response>
        /// <response code="400">Los datos del item no son válidos.</response>
        /// <response code="404">No se encontró el item con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemCreateDto itemDto)
        {
            try
            {
                _logger.LogInformation($"Iniciando actualización de item con ID: {id}");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de item no válidos para actualización. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _itemService.UpdateItemAsync(id, itemDto);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró el item con ID: {id} para actualizar");
                    return NotFound();
                }

                _logger.LogInformation($"Item con ID: {id} actualizado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar el item con ID {id}");
                return StatusCode(500, "Error interno del servidor al actualizar el item");
            }
        }

        /// <summary>
        /// Elimina un item existente.
        /// </summary>
        /// <param name="id">ID del item a eliminar.</param>
        /// <returns>NoContent si la eliminación fue exitosa, o NotFound si el item no existe.</returns>
        /// <response code="204">El item se eliminó correctamente.</response>
        /// <response code="404">No se encontró el item con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                _logger.LogInformation($"Iniciando eliminación de item con ID: {id}");
                
                var result = await _itemService.DeleteItemAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró el item con ID: {id} para eliminar");
                    return NotFound();
                }

                _logger.LogInformation($"Item con ID: {id} eliminado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar el item con ID {id}");
                return StatusCode(500, "Error interno del servidor al eliminar el item");
            }
        }
    }
}
