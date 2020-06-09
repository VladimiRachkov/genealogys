using System;
using System.Collections.Generic;
using Genealogy.Models.Domain.Dtos;
using Genealogy.Models.Domain.Filters;

namespace Genealogy.Service.Astract
{
    partial interface IGenealogyService
    {
        List<CemeteryDto> GetCemetery(CemeteryFilter filter);
        CemeteryDto AddCemetery(CemeteryDto newCemetery);
        List<CemeteryDto> GetCemeteryList();
        CemeteryDto MarkAsRemovedCemetery(Guid cemetery);
        CemeteryDto ChangeCemetery(CemeteryDto cemeteryDto);
    }
}