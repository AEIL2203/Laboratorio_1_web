using AutoMapper;
using MessageApi.Models;
using MessageApi.Models.DTOs;

namespace MessageApi.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Entity -> Read DTO
            CreateMap<Product, ProductReadDto>();
            CreateMap<Item, ItemReadDto>();
            CreateMap<Message, MessageReadDto>();
            CreateMap<Person, PersonReadDto>();
            CreateMap<Order, OrderReadDto>();
            CreateMap<OrderDetail, OrderDetailReadDto>();

            // Create/Update DTO -> Entity
            CreateMap<ProductCreateDto, Product>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ItemCreateDto, Item>();
            CreateMap<ItemUpdateDto, Item>();
            CreateMap<MessageCreateDto, Message>();
            CreateMap<MessageUpdateDto, Message>();
            CreateMap<PersonCreateDto, Person>();
            CreateMap<PersonUpdateDto, Person>();
            CreateMap<OrderCreateDto, Order>();
            CreateMap<OrderDetailCreateDto, OrderDetail>();
        }
    }
}
