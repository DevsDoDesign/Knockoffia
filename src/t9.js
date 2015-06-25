export function* key2() {
	var letters = ['a', 'b', 'c', '2']
	var index = 0;

	while (true) {
		var reset = yield letters[index++]

		if (reset) index = 0;
	}
}

export function* key3() {
	var letters = ['d','e','f','3'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key4() {
	var letters = ['g','h','i','4'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key5() {
	var letters = ['j','k','l','5'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key6() {
	var letters = ['m','n','o','6'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key7() {
	var letters = ['p','q','r','s','7'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key8() {
	var letters = ['t','u','v','8']
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key9() {
	var letters = ['w','x','y','z','9']
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}

export function* key0() {
	var letters = [' ', '0'];
	var index = 0;

	while (true) {
		var reset = yield letters[index++];

		if (reset) index = 0;
	}
}