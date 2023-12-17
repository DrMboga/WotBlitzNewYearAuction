using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace WotBlitzNewYearAuction;


public static class HttpHelper
{
    const string AuctionApiUrl = "https://eu.wotblitz.com/en/api/events/items/auction/?page_size=80&type[]=vehicle&saleable=true";

    public static async Task<JsonObject?> GetAuctionData(this HttpClient client) {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("User-Agent", ".NET Auction app");

        await using Stream stream = await client.GetStreamAsync(AuctionApiUrl);
        var response = await JsonSerializer.DeserializeAsync<JsonObject>(stream);

        return response;
    }

}
