﻿using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Repositories
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ExilenceContext _exilenceContext;
        public GroupRepository(ExilenceContext context)
        {
            _exilenceContext = context;
        }

        public async Task<Group> AddGroup(Group group)
        {
            await _exilenceContext.Groups.AddAsync(group);
            return group;
        }

        public async Task<Group> GetGroup(string name)
        {
            var group = await _exilenceContext.Groups.FirstOrDefaultAsync(g => g.Name == name);
            return group;
        }

        public async Task<Group> RemoveGroup(string name)
        {
            var group = await GetGroup(name);
            _exilenceContext.Remove(group);
            return group;
        }

        public async Task SaveChangesAsync()
        {
            await _exilenceContext.SaveChangesAsync();
        }
    }
}
