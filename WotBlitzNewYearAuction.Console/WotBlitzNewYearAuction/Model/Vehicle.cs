namespace WotBlitzNewYearAuction;

public class Vehicle
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("nation")]
    public string Nation { get; set; } = string.Empty;

    [JsonPropertyName("type_slug")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("roman_level")]
    public string Tier { get; set; } = string.Empty;

    [JsonPropertyName("user_string")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("image_url")]
    public string ImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("preview_image_url")]
    public string PreviewImageUrl { get; set; } = string.Empty;

    [JsonPropertyName("is_premium")]
    public bool IsPremium { get; set; }

    [JsonPropertyName("is_collectible")]
    public bool IsCollectible { get; set; }

    
}
