import Vue from 'vue';

const fieldFactory = (id, label) => {
  const htmlId =  `me-${id}-${label.toLowerCase()}`;
  const model = label.toLowerCase().replace(' ', '');
  return $('<div class="row"></div>').append(
    $(`<label for="${htmlId}"class="control-label cols-xs-12 col-md-2">${label}</div>`),
    $('<div class="col-xs-12 col-md-10"></div>').append(
      $('<div class="input-group" style="width: 100%;"></div>').append(
       $(`<input type="text" class="form-control" name="${htmlId}" id="${htmlId}" spellcheck="false" v-model="${model}" />`))));
}

const sectionFactory = ($field, childFields) => {
	const val = $field.val();
	const $row = $field.closest('.row');
	$row.wrap('<div></div>').hide();
	const $el = $row.parent();
	$field.attr('v-model', 'result');
	const id = $field.attr('id');
	const $vueWrap = $(`<div id="me-${id}"></div>`);
	$el.prepend($vueWrap);

	const data = {
		temp: val,
	}
	let t = data.temp;
	data.temp = '';
	childFields.forEach(f => {
		t = t.split("\n").filter((line) => f.get(val).trim() !== line.trim()).join('');
		data[childFields[0].name] = childFields[0].set(t); // put the non-matched content to the first field
		
		$vueWrap.append(
			fieldFactory(id, f.label),
		);
		return data[f.name] = f.get(val)
	});
	const vue = new Vue({
	  el: $el[0], 
	  data: data,
	  computed: {
	    result: function() {
	    	const out = [];
	    	out.push(this.temp);
	    	childFields.forEach(f => {
	    		const v = f.set(this[f.name]);
	    		if(v.length > 0)
	    			out.push(v);
	    	})
	      return out.filter(x => x.trim().length > 0).join("\n");
	   }
	  }
	});
}

sectionFactory($('#input-Engine'), [
	{name:'engine', label:'Engine', get: input => '', set: v => v},
	{name:'year', label:'Year', get: input => input.match(/Year: (.*)/im) ? input.match(/Year: (.*)/im)[1]:'', set: v => v ? `Year: ${v}` : ''},
	{name:'cooling', label:'Cooling', get: input => input.match(/Cooling: (.*)/im)? input.match(/Cooling: (.*)/im)[1]:'', set: v => v ? `Cooling: ${v}` : ''},
])
