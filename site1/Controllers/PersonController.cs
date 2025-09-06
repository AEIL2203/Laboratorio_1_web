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
    /// Controlador para gestionar las operaciones CRUD de personas.
    /// Proporciona endpoints para crear, leer, actualizar y eliminar personas.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PersonController : ControllerBase
    {
        private readonly IPersonService _personService;
        private readonly ILogger<PersonController> _logger;
        private readonly IMapper _mapper;

        /// <summary>
        /// Inicializa una nueva instancia del controlador de personas.
        /// </summary>
        public PersonController(
            IPersonService personService,
            ILogger<PersonController> logger,
            IMapper mapper)
        {
            _personService = personService ?? throw new ArgumentNullException(nameof(personService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Obtiene todas las personas existentes en el sistema.
        /// </summary>
        /// <returns>Una lista de todas las personas.</returns>
        /// <response code="200">Retorna la lista de personas.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<PersonReadDto>>> GetAllPersons()
        {
            try
            {
                _logger.LogInformation("Obteniendo todas las personas");
                var persons = await _personService.GetAllPersonsAsync();
                return Ok(persons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener las personas");
                return StatusCode(500, "Error interno del servidor al obtener las personas");
            }
        }

        /// <summary>
        /// Obtiene una persona específica por su ID.
        /// </summary>
        /// <param name="id">ID de la persona a buscar.</param>
        /// <returns>La persona solicitada o NotFound si no existe.</returns>
        /// <response code="200">Retorna la persona solicitada.</response>
        /// <response code="404">No se encontró la persona con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpGet("{id}", Name = "GetPersonById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PersonReadDto>> GetPersonById(int id)
        {
            try
            {
                _logger.LogInformation($"Buscando persona con ID: {id}");
                var person = await _personService.GetPersonByIdAsync(id);
                if (person == null)
                {
                    _logger.LogWarning($"No se encontró la persona con ID: {id}");
                    return NotFound();
                }
                return Ok(person);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener la persona con ID {id}");
                return StatusCode(500, "Error interno del servidor al obtener la persona");
            }
        }

        /// <summary>
        /// Crea una nueva persona en el sistema.
        /// </summary>
        /// <param name="personDto">DTO con los datos de la persona a crear.</param>
        /// <returns>La persona recién creada con su ID asignado.</returns>
        /// <response code="201">Retorna la persona creada.</response>
        /// <response code="400">Los datos de la persona no son válidos.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PersonReadDto>> CreatePerson([FromBody] PersonCreateDto personDto)
        {
            try
            {
                _logger.LogInformation("Iniciando creación de nueva persona");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de persona no válidos. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var person = await _personService.CreatePersonAsync(personDto);
                _logger.LogInformation($"Persona creada exitosamente con ID: {person.Id}");
                
                return CreatedAtRoute(nameof(GetPersonById), new { id = person.Id }, person);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear la persona");
                return StatusCode(500, "Error interno del servidor al crear la persona");
            }
        }

        /// <summary>
        /// Actualiza una persona existente.
        /// </summary>
        /// <param name="id">ID de la persona a actualizar.</param>
        /// <param name="personDto">DTO con los nuevos datos de la persona.</param>
        /// <returns>NoContent si la actualización fue exitosa, o NotFound si la persona no existe.</returns>
        /// <response code="204">La persona se actualizó correctamente.</response>
        /// <response code="400">Los datos de la persona no son válidos.</response>
        /// <response code="404">No se encontró la persona con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdatePerson(int id, [FromBody] PersonCreateDto personDto)
        {
            try
            {
                _logger.LogInformation($"Iniciando actualización de persona con ID: {id}");
                
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Datos de persona no válidos para actualización. Errores: {ModelState}", ModelState);
                    return BadRequest(ModelState);
                }

                var result = await _personService.UpdatePersonAsync(id, personDto);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró la persona con ID: {id} para actualizar");
                    return NotFound();
                }

                _logger.LogInformation($"Persona con ID: {id} actualizada exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar la persona con ID {id}");
                return StatusCode(500, "Error interno del servidor al actualizar la persona");
            }
        }

        /// <summary>
        /// Elimina una persona existente.
        /// </summary>
        /// <param name="id">ID de la persona a eliminar.</param>
        /// <returns>NoContent si la eliminación fue exitosa, o NotFound si la persona no existe.</returns>
        /// <response code="204">La persona se eliminó correctamente.</response>
        /// <response code="404">No se encontró la persona con el ID especificado.</response>
        /// <response code="500">Error interno del servidor al procesar la solicitud.</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeletePerson(int id)
        {
            try
            {
                _logger.LogInformation($"Iniciando eliminación de persona con ID: {id}");
                
                var result = await _personService.DeletePersonAsync(id);
                if (!result)
                {
                    _logger.LogWarning($"No se encontró la persona con ID: {id} para eliminar");
                    return NotFound();
                }

                _logger.LogInformation($"Persona con ID: {id} eliminada exitosamente");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar la persona con ID {id}");
                return StatusCode(500, "Error interno del servidor al eliminar la persona");
            }
        }
    }
}
