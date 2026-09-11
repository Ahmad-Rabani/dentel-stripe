import type { Schema, Struct } from '@strapi/strapi';

export interface AboutStat extends Struct.ComponentSchema {
  collectionName: 'components_about_stats';
  info: {
    displayName: 'Statistic';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AboutValue extends Struct.ComponentSchema {
  collectionName: 'components_about_values';
  info: {
    displayName: 'Value';
    icon: 'star';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ArticleAuthor extends Struct.ComponentSchema {
  collectionName: 'components_article_authors';
  info: {
    displayName: 'Author';
    icon: 'user';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface ProductSpecification extends Struct.ComponentSchema {
  collectionName: 'components_product_specifications';
  info: {
    displayName: 'Specification';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'about.stat': AboutStat;
      'about.value': AboutValue;
      'article.author': ArticleAuthor;
      'product.specification': ProductSpecification;
      'shared.social-link': SharedSocialLink;
    }
  }
}
