﻿using Genealogy.Data;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Genealogy.Migrations
{
    public partial class AddSubscribeMetatype : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Metatypes",
                columns: new[] { "Id", "Name", "Title" },
                values: new object[] { MetatypeData.Subscription.Id, "SUBSCRIPTION", "Подписка" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(table: "Metatypes",
                keyColumn: "Id",
                keyValue: MetatypeData.Subscription.Id);
        }
    }
}
