class Pagination{
    constructor({page, perPage, totalCount}){
        this._page_ = page
        this._perPage_ = perPage
        this._totalCount_ = totalCount
    }
    get page(){
        return this._page_
    }
    set page(page){
        this._page_ = page
    }
    get perPage(){
        return this._perPage_
    }
    set perPage(perPage){
        this._perPage_ = perPage
    }
    get totalCount(){
        return this._totalCount_
    }
    set totalCount(totalCount){
        this._totalCount_ = totalCount
    }
    firstPage(){
        return this._totalCount_ ? 0 : null
    }
    lastPage(){
        return this._totalCount_ ? Math.ceil(this._totalCount_ / this._perPage_) : null
    }
    prevPage(){
        return this._totalCount_ ? (this._page_ - 1 < this.firstPage() ? this.firstPage() : this._page_ - 1) : null
    }
    nextPage(){
        return this._totalCount_ ? (this._page_ + 1 >= this.lastPage() ? this.lastPage() : this._page_ + 1) : null
    }
}

exports.getInstance = function(param){
    let {page, perPage, totalCount} = param

    return new Pagination({page:page, perPage:perPage, totalCount:totalCount})
}