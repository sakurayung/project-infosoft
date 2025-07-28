using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace project_infosoft.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceToVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Video",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Video");
        }
    }
}
