using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class CharacterProfileMapper: Profile
    {
        public CharacterProfileMapper()
        {
            CreateMap<CharacterModel, Character>();
            CreateMap<Character, CharacterModel>();
        }
    }
}
