import { stdin as input, stdout as output } from 'process';
import * as readline from 'readline';

/**
 * Prompt user for input with optional masking for secrets
 */
export async function prompt(question: string, mask: boolean = false): Promise<string> {
  return new Promise((resolve) => {
    if (mask) {
      // Hide input for secrets
      let hiddenInput = '';

      output.write(question);

      // Create readline interface with no terminal to prevent echo
      const rl = readline.createInterface({
        input,
        output,
        terminal: false,
      });

      // Set raw mode to capture each character
      if (input.isTTY) {
        input.setRawMode(true);
      }

      const cleanup = () => {
        if (input.isTTY) {
          input.setRawMode(false);
        }
        input.removeListener('data', onData);
        rl.close();
      };

      const onData = (char: Buffer) => {
        const str = char.toString('utf8');

        switch (str) {
          case '\n':
          case '\r':
          case '\u0004': // Ctrl+D
            cleanup();
            output.write('\n');
            resolve(hiddenInput);
            break;
          case '\u0003': // Ctrl+C
            cleanup();
            output.write('\n');
            process.exit(0);
            break;
          case '\u007f': // Backspace (DEL)
          case '\b': // Backspace
            if (hiddenInput.length > 0) {
              hiddenInput = hiddenInput.slice(0, -1);
              // Visual feedback: move cursor back, print space, move back again
              output.write('\b \b');
            }
            break;
          default:
            // Only accept printable characters
            if (str >= ' ' && str <= '~') {
              hiddenInput += str;
              // Show asterisk for each character
              output.write('*');
            }
            break;
        }
      };

      input.on('data', onData);
    } else {
      // Normal visible input
      const rl = readline.createInterface({ input, output });
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

/**
 * Prompt user with confirmation (y/n)
 */
export async function confirm(question: string, defaultValue: boolean = false): Promise<boolean> {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  const answer = await prompt(`${question} (${defaultText}): `);

  if (!answer || answer.trim() === '') {
    return defaultValue;
  }

  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}
