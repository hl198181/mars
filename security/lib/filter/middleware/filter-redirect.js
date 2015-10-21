/**
 * Created by leon on 15/10/21.
 */


module.exports = FilterRedirect

function FilterRedirect(path, state) {
    this._path = path;
    this._state = state || 302;
}
