using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace WotBlitzNewYearAuction;


public static class HttpHelper
{
    // Publish and run locally WotBlitzNewYearAuction.NoCorsProxy
    const string AuctionApiUrl = "http://localhost:6001/auction";

    public static async Task<AuctionResponse?> GetAuctionData(this HttpClient client) {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("User-Agent", ".NET Auction app");

        await using Stream stream = await client.GetStreamAsync(AuctionApiUrl);
        var response = await JsonSerializer.DeserializeAsync<AuctionResponse>(stream);

        return response;
    }

}
