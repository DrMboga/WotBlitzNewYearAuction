namespace WotBlitzNewYearAuction;

public class ItemPrice
{
    [JsonPropertyName("value")]
    public int PriceValue { get; set; }

    [JsonPropertyName("currency")]
    public Currency? Currency { get; set; }
}
