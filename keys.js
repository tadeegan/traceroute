var api_keys = {
	google_maps: 'your key here'
}
function key_for(name){
	return api_keys[name];
}
exports.key_for = key_for;