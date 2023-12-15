using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Components.WebAssembly.Http;

namespace WotBlitzNewYearAuction;


public static class HttpHelper
{
    const string AuctionApiUrl = "https://eu.wotblitz.com/en/api/events/items/auction/?page_size=80&type[]=vehicle&saleable=true";

    public static async Task<AuctionResponse?> GetAuctionData(this HttpClient client) {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));
        client.DefaultRequestHeaders.Add("User-Agent", ".NET Auction app");

        var request = new HttpRequestMessage(HttpMethod.Get, AuctionApiUrl);
        request.SetBrowserRequestMode(BrowserRequestMode.NoCors);
        
        var httpResponse = await client.SendAsync(request);
        httpResponse.EnsureSuccessStatusCode();
        await using Stream stream = await httpResponse.Content.ReadAsStreamAsync();
        var response = await JsonSerializer.DeserializeAsync<AuctionResponse>(stream);

        return response;
    }

}
