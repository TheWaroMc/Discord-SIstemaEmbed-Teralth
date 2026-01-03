export interface WebhookData {
  url: string;
  username: string;
  avatarUrl: string;
}

export interface EmbedData {
  title: string;
  description: string;
  color: string;
  footer: {
    text: string;
    iconUrl: string;
  };
  thumbnail: string;
  image: string;
  author: {
    name: string;
    iconUrl: string;
    url: string;
  };
  fields: EmbedField[];
  timestamp: boolean;
}

export interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

export interface ButtonData {
  label: string;
  style: number;
  url?: string;
  customId?: string;
}
