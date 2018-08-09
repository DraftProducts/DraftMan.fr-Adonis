'use strict'

const Model = use('Model')

class Portfolio extends Model {
    static get table () {
        return 'portfolio'
    }
    details () {
        return this.belongsTo('App/Models/PortfolioDetails', 'id', 'portfolio_details_id')
    }
}

module.exports = Portfolio