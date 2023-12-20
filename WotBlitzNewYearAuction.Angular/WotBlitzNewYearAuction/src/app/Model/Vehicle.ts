export interface Vehicle {
  id: number;

  nation: string;

  type_slug: string;

  roman_level: string;

  // Name
  user_string: string;

  image_url: string;

  preview_image_url: string;

  is_premium: boolean;

  is_collectible: boolean;
}
