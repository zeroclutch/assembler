/* eslint-disable prettier/prettier */
type OperationType = 'R' | 'I';

type Operation = {
    type: OperationType;
    opcode: number;
}

export const Operations: {[key: string]: Operation } = {
    'LW':  { opcode: 0b000, type: 'R' },
    'SW':  { opcode: 0b001, type: 'R' },
    'SUB':  { opcode: 0b010, type: 'R' },
    'ADD':  { opcode: 0b011, type: 'R' },
    'DISP': { opcode: 0b100, type: 'R' },
    'HALT': { opcode: 0b101, type: 'R' },
    'SUBI': { opcode: 0b110, type: 'I' },
    'ADDI': { opcode: 0b111, type: 'I' },
};

const OPCODE_LENGTH = 4;
const REGISTER_LENGTH = 4;

class Instruction {
    operation: number;
    rd: number;
    r1: number;
    r2: number;

    type: OperationType;
    constructor(line: number, ...args: string[]) {

        const operation = args[0].toUpperCase()
        assert(operation in Operations, `Invalid operation at line ${line}: ${operation}`);

        this.operation = Operations[operation].opcode;
        this.type = Operations[operation].type;
        this.rd = parseInt(args[1].replace(/\D/g, ''));
        this.r1 = parseInt(args[2].replace(/\D/g, ''));
        this.r2 = parseInt(args[3].replace(/\D/g, ''));

        assert(this.rd <= (2 ** (REGISTER_LENGTH - 1)), `Destination register out of range at line ${line}: ${this.rd}`);
        assert(this.r1 <= (2 ** (REGISTER_LENGTH - 1)), `r1 register out of range at line ${line}: ${this.r1}`);
        assert(this.r2 <= (2 ** (REGISTER_LENGTH - 1)), `r2 register out of range at line ${line}: ${this.r2}`);

    }

    static LENGTH: number = 4;
}

const assert = (condition: boolean, message: string) => {
    if (!condition) {
        throw new Error(message);
    }
}


function getMachineCode(i: Instruction): number {
    let code = 0
    //code <<= 1;
    code |= i.operation;
    code <<= OPCODE_LENGTH;
    code |= i.rd;
    code <<= REGISTER_LENGTH;
    code |= i.r1;
    code <<= REGISTER_LENGTH;
    code |= i.r2;
    return code;

}

export function assemble(assembly: string): string {
    let result = '';
    assembly.split('\n').forEach((line, index) => {
        if(line === '') return;

        const tokens = line.split(' ')
        
        assert (tokens.length === Instruction.LENGTH, `Invalid instruction format at line ${index + 1}: ${line}`);
        const i = new Instruction(index + 1, ...tokens);

        const machineCode = getMachineCode(i);
        result += `${machineCode.toString(16).padStart(4, '0')} // ${line}<br>`
    })
    return result
}