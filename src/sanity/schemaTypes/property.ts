import {defineArrayMember, defineField, defineType} from 'sanity'

export const propertyType = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'welcomeMessage',
      title: 'Welcome Message',
      type: 'text',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wifiNetwork',
      title: 'Wi-Fi Network',
      type: 'string',
    }),
    defineField({
      name: 'wifiPassword',
      title: 'Wi-Fi Password',
      type: 'string',
    }),
    defineField({
      name: 'checkoutProcedure',
      title: 'Check-out Procedure',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add one step per item for a clear checklist',
    }),
    defineField({
      name: 'guides',
      title: 'Property Guides',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: { type: 'guide' },
        }),
      ],
    }),
    defineField({
      name: 'recommendations',
      title: 'Local Recommendations',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: { type: 'recommendation' },
        }),
      ],
    }),
  ],
})
