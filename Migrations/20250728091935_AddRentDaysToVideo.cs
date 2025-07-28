using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_infosoft.Migrations
{
    /// <inheritdoc />
    public partial class AddRentDaysToVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentDays",
                table: "Video",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentDays",
                table: "Video");
        }
    }
}
