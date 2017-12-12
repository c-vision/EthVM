import { Block, FIFO } from '@/libs'
import globConfigs from '@/configs/global.json'

let setUncles = (hash: string, blocks: Array<Block>): Array<Block> => {
	for (let i = 0; i < blocks.length; i++) {
		if (blocks[i].getHash() == hash) {
			blocks[i].setTransactions([])
			blocks[i].setIsUncle(true)
		}
	}
	return blocks;
}
let setUnclesToUncles = (block: Block, pastBlocks: FIFO<Block>): FIFO<Block> => {
	let tPastBlocks = pastBlocks.items()
	for (let i = 0; i < block.getUncles().length; i++) {
		tPastBlocks = setUncles(block.getUncles()[i], tPastBlocks)
	}
	tPastBlocks.sort(function(a, b) { return a.getIntNumber() - b.getIntNumber() })
	let newfifo = new FIFO<Block>(globConfigs.maxBlocksInMemory)
	for (let i = 0; i < tPastBlocks.length; i++) {
		newfifo.add(tPastBlocks[i])
	}
	return newfifo
}

export default setUnclesToUncles