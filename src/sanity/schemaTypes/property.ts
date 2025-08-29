import {defineField, defineType} from 'sanity'

export const propertyType = defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
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
      type: 'text',
    }),
  ],
})
