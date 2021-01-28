interface FontType {
	[key: string]: string;
}

export = {
	convert: (t = '', font: FontType = {}): string =>
		t.split('').reduce((prev, next) => `${prev}${font[next] || next}`, ''),
};
