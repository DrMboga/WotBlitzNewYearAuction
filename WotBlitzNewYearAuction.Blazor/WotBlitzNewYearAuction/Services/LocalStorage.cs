using System.Text.Json;
using Microsoft.JSInterop;

namespace WotBlitzNewYearAuction;

public class LocalStorage
{
    private const string LocalStorageStateKey = "initial-prices";
    private readonly IJSRuntime _jsRuntime;

    public LocalStorage(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async Task<InitialPrices[]> ReadInitialPrices()
    {
        var json = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", LocalStorageStateKey);
        if(!string.IsNullOrEmpty(json))
        {
            var state = JsonSerializer.Deserialize<InitialPrices[]>(json);
            if(state != null)
            {
                return state;
            }
        }
        return [];
    }

    public async Task SetInitialPrice(InitialPrices initialPrice)
    {
        var prices = await ReadInitialPrices();
        var currentPriceValue = prices.FirstOrDefault(p => p.VehicleId == initialPrice.VehicleId);
        if (currentPriceValue == null)
        {
            var pricesAsList = prices.ToList();
            pricesAsList.Add(initialPrice);
            prices = pricesAsList.ToArray();
        }
        else
        {
            currentPriceValue.InitialPrice = initialPrice.InitialPrice;
        }
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem",
            LocalStorageStateKey, JsonSerializer.Serialize(prices));
    }
}
