import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'locations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.float('accuracy').notNullable()
      table.timestamp('timestamp').notNullable()
      table.string('country').notNullable()
      table.string('state').notNullable()
      table.text('description').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()

      table.index(['country', 'state'])
      table.index(['created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}