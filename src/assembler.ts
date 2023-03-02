/* eslint-disable prettier/prettier */
type OperationType = 'R' | 'I' | 'B';

type Operation = {
    type: OperationType;
    opcode: number;
}

export const Operations: {[key: string]: Operation } = {
    'LW':  { opcode: 0b0000, type: 'R' },
    'MV':  { opcode: 0b0001, type: 'R' },
    'SUB':  { opcode: 0b0010, type: 'R' },
    'ADD':  { opcode: 0b0011, type: 'R' },
    'DISP': { opcode: 0b0100, type: 'R' },
    'HALT': { opcode: 0b0101, type: 'R' },
    'SUBI': { opcode: 0b0110, type: 'I' },
    'ADDI': { opcode: 0b0111, type: 'I' },
    'SW':   { opcode: 0b1000, type: 'R' },
    'BZ':   { opcode: 0b1001, type: 'B' },
    'BNZ':  { opcode: 0b1010, type: 'B' },
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

        assert(this.rd < (2 ** (REGISTER_LENGTH - 1)), `Destination register out of range at line ${line}: ${this.rd}`);
        assert(this.r1 < (2 ** (REGISTER_LENGTH - 1)), `r1 register out of range at line ${line}: ${this.r1}`);
        assert(this.r2 < (2 ** (REGISTER_LENGTH - 1)), `r2 register out of range at line ${line}: ${this.r2}`);

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

        let comment = '';
        if(line.indexOf('//') !== -1) {
            comment = line.slice(line.indexOf('//') , line.length).replace('//', '');
            line = line.slice(0, line.indexOf('//'));
        }

        line = line.trim();
        
        const tokens = line.split(/\s+/)

        
        assert (tokens.length === Instruction.LENGTH, `Invalid instruction format at line ${index + 1}: ${line}`);
        const i = new Instruction(index + 1, ...tokens);

        const machineCode = getMachineCode(i);
        result += `${machineCode.toString(16).padStart(4, '0')} // ${line}${comment}<br>`
    })
    return result
}