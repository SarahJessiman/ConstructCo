﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConstructCoAPI.Data;
using ConstructCoAPI.Data.Models;
using System.Linq.Dynamic.Core;

namespace ConstructCoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ConstructCoDbContext _context;

        public ProjectsController(ConstructCoDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet]
        public async Task<ActionResult<ApiResult<Project>>> GetProjects(
            int pageIndex = 0,
            int pageSize = 10,
            string? sortColumn = null,
            string? sortOrder = null,
            string? filterColumn = null,
            string? filterQuery = null)
        {
            return await ApiResult<Project>.CreateAsync(
                   _context.Projects.AsNoTracking(),
                   pageIndex,
                   pageSize,
                   sortColumn,
                   sortOrder,
                   filterColumn,
                   filterQuery
                   );

        }

        // GET: api/Projects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            return project;
        }

        // PUT: api/Projects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, Project project)
        {
            if (id != project.ProjectId)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Projects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Project>> PostProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProject", new { id = project.ProjectId }, project);
        }

        // DELETE: api/Projects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.ProjectId == id);
        }

        [HttpPost]
        [Route("IsDupeProject")]
        public bool IsDupeProject(Project project)
        {
            return _context.Projects.Any(
            e => e.Name == project.Name
            && e.Value == project.Value
            && e.Balance == project.Balance
            && e.EmployeeId == project.EmployeeId
            && e.ProjectId != project.ProjectId
            );
        }

        [HttpPost]
        [Route("IsDupeField")]
        public bool IsDupeField(
           int projectId,
           string fieldName,
           string fieldValue)
        {
            return (ApiResult<Project>.IsValidProperty(fieldName, true))
            ? _context.Projects.Any(
            string.Format("{0} == @0 && projectId != @1", fieldName),
            fieldValue,
            projectId)
            : false;
        }
    }
}
