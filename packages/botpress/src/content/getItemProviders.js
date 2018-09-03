module.exports = {
  random: (knex, category, args) => {
    return knex('content_items')
      .where({ categoryId: category })
      .orderBy(knex.raw('random()'))
      .limit(1)
      .get(0)
  }
}
