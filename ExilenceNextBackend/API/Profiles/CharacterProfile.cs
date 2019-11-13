using AutoMapper;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Profiles
{
    public class CharacterProfile: Profile
    {
        public CharacterProfile()
        {
            CreateMap<Character, CharacterModel>();
            CreateMap<CharacterModel, Character>();
        }
    }
}
