'use strict'

const Model = use('Model')

class Portfolio extends Model {
    static get table () {
        return 'portfolio'
    }
    details () {
        return this.belongsTo('App/Models/PortfolioDetails', 'portfolio_details_id', 'id')
    }
}

module.exports = Portfolio