namespace WotBlitzNewYearAuction;

public class AuctionItem
{
    [JsonPropertyName("available")]
    public bool Available { get; set; }

    [JsonPropertyName("entity")]
    public Vehicle? Vehicle { get; set; }

    [JsonPropertyName("initial_count")]
    public int InitialCount { get; set; }

    [JsonPropertyName("current_count")]
    public int CurrentCount { get; set; }

    [JsonPropertyName("available_from")]
    public DateTime AvailableFrom { get; set; }

    [JsonPropertyName("available_before")]
    public DateTime AvailableBefore { get; set; }

    [JsonPropertyName("next_price_datetime")]
    public DateTime? NextPriceDropAt { get; set; }

    [JsonPropertyName("price")]
    public ItemPrice? Price { get; set; }

    [JsonPropertyName("next_price")]
    public ItemPrice? NextPrice { get; set; }

    [JsonIgnore]
    public int InitialPrice { get; set; }
}
