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
    /// Controlador para gestionar las operaciones CRUD de productos.
    /// Proporciona endpoints para crear, leer, actualizar y eliminar productos.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductController> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Inicializa una nueva instancia del controlador de productos.
        /// </summary>
        public ProductController(
            IProductService productService,
            ILogger<ProductController> logger,
            IMapper mapper)
        {
            _productService = productService ?? throw new ArgumentNullException(nameof(productService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Obtiene todos los productos existentes en el sistema.
        /// </summary>
        /// <returns>Una lista de todos los productos.</returns>
        /// <response code="200">Retorna la lista de productos.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAllProducts()
        {
            try
            {
                _logger.LogInformation("Obteniendo todos los productos");
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los productos");
                return StatusCode(500, "Error interno del servidor al obtener los productos");
            }
        }

        /// <summary>
        /// Obtiene un producto específico por su ID.
        /// </summary>
        /// <param name="id">ID del producto a buscar.</param>
        /// <returns>El producto solicitado o NotFound si no existe.</returns>
        /// <response code="200">Retorna el producto solicitado.</response>
        /// <response code="404">No se encontró el producto con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet("{id}", Name = "GetProductById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductReadDto>> GetProductById(int id)
        {
            try
            {
                _logger.LogInformation($"Buscando producto con ID: {id}");
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    _logger.LogWarning($"No se encontró el producto con ID: {id}");
                    return NotFound();
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener el producto con ID {id}");
                return StatusCode(500, "Error interno del servidor al obtener el producto");
            }
        }

        /// <summary>
        /// Crea un nuevo producto en el sistema.
        /// </summary>
        /// <param name="productDto">DTO con los datos del producto a crear.</param>
        /// <returns>El producto recién creado con su ID asignado.</returns>
        /// <response code="201">Retorna el producto creado.</response>
        /// <response code="400">Los datos del producto no son válidos.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductReadDto>> CreateProduct([FromBody] ProductCreateDto productDto)
        {
            try
            {
                _logger.LogInformation("Iniciando creación de nuevo producto");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de producto no válidos. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var product = await _productService.CreateProductAsync(productDto);
                _logger.LogInformation($"Producto creado exitosamente con ID: {product.Id}");
                
                return CreatedAtRoute(nameof(GetProductById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear el producto");
                return StatusCode(500, "Error interno del servidor al crear el producto");
            }
        }

        /// <summary>
        /// Actualiza un producto existente.
        /// </summary>
        /// <param name="id">ID del producto a actualizar.</param>
        /// <param name="productDto">DTO con los nuevos datos del producto.</param>
        /// <returns>NoContent si la actualización fue exitosa, o NotFound si el producto no existe.</returns>
        /// <response code="204">El producto se actualizó correctamente.</response>
        /// <response code="400">Los datos del producto no son válidos.</response>
        /// <response code="404">No se encontró el producto con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateDto productDto)
        {
            try
            {
                _logger.LogInformation($"Iniciando actualización de producto con ID: {id}");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de producto no válidos para actualización. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _productService.UpdateProductAsync(id, productDto);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró el producto con ID: {id} para actualizar");
                    return NotFound();
                }

                _logger.LogInformation($"Producto con ID: {id} actualizado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar el producto con ID {id}");
                return StatusCode(500, "Error interno del servidor al actualizar el producto");
            }
        }

        /// <summary>
        /// Elimina un producto existente.
        /// </summary>
        /// <param name="id">ID del producto a eliminar.</param>
        /// <returns>NoContent si la eliminación fue exitosa, o NotFound si el producto no existe.</returns>
        /// <response code="204">El producto se eliminó correctamente.</response>
        /// <response code="404">No se encontró el producto con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                _logger.LogInformation($"Iniciando eliminación de producto con ID: {id}");
                
                var result = await _productService.DeleteProductAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró el producto con ID: {id} para eliminar");
                    return NotFound();
                }

                _logger.LogInformation($"Producto con ID: {id} eliminado exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar el producto con ID {id}");
                return StatusCode(500, "Error interno del servidor al eliminar el producto");
            }
        }
    }
}
