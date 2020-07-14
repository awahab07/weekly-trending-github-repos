export type HmrAcceptor = (module: string, callback: () => void) => void;

const runForHmr = (fns: ((accept: HmrAcceptor) => void)[]): void => {
  if (
    module && process?.env?.NODE_ENV === 'development' && (module as any).hot
  ) {
    const accept: HmrAcceptor = (module as any).hot.accept;
    for (const f of fns) {
      f.call(module, accept);
    }
  }
};

export default runForHmr;
