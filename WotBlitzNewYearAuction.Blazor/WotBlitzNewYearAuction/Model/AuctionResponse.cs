namespace WotBlitzNewYearAuction;

public class AuctionResponse
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("results")]
    public AuctionItem[]? AuctionItems { get; set; }
}
