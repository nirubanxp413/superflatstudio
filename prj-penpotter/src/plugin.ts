// Runs in the Penpot plugin runtime — only here may the `penpot` global be used.

penpot.ui.open('PenpotChat', `index.html?theme=${penpot.theme}`, {
  width: 340,
  height: 600,
});

penpot.ui.onMessage(async (msg: unknown) => {
  if (!msg || typeof msg !== 'object') return;
  const m = msg as { type?: string; args?: Record<string, unknown> };
  if (typeof m.type !== 'string') return;

  let result: unknown = null;

  try {
    if (m.type === 'createBoard') {
      const args = m.args ?? {};
      const board = penpot.createBoard();
      board.name = (args.name as string) ?? 'Board';
      board.x = (args.x as number) ?? 0;
      board.y = (args.y as number) ?? 0;
      board.resize((args.width as number) ?? 360, (args.height as number) ?? 640);
      result = { id: board.id, name: board.name };
    }

    if (m.type === 'createRectangle') {
      const args = m.args ?? {};
      const rect = penpot.createRectangle();
      rect.name = (args.name as string) ?? 'Rectangle';
      rect.x = (args.x as number) ?? 0;
      rect.y = (args.y as number) ?? 0;
      rect.resize((args.width as number) ?? 100, (args.height as number) ?? 100);
      if (args.fillColor) {
        rect.fills = [{ fillColor: args.fillColor as string, fillOpacity: 1 }];
      }
      if (args.borderRadius != null) {
        rect.borderRadius = args.borderRadius as number;
      }
      result = { id: rect.id };
    }

    if (m.type === 'createText') {
      const args = m.args ?? {};
      const text = penpot.createText((args.text as string) ?? '');
      if (text) {
        text.name = (args.name as string) ?? 'Text';
        text.x = (args.x as number) ?? 0;
        text.y = (args.y as number) ?? 0;
        if (args.fontSize != null) {
          text.fontSize = String(args.fontSize);
        }
        if (args.fillColor) {
          text.fills = [{ fillColor: args.fillColor as string, fillOpacity: 1 }];
        }
        result = { id: text.id };
      }
    }

    if (m.type === 'createEllipse') {
      const args = m.args ?? {};
      const ellipse = penpot.createEllipse();
      ellipse.name = (args.name as string) ?? 'Ellipse';
      ellipse.x = (args.x as number) ?? 0;
      ellipse.y = (args.y as number) ?? 0;
      ellipse.resize((args.width as number) ?? 100, (args.height as number) ?? 100);
      if (args.fillColor) {
        ellipse.fills = [{ fillColor: args.fillColor as string, fillOpacity: 1 }];
      }
      result = { id: ellipse.id };
    }

    if (m.type === 'getSelection') {
      result = penpot.selection.map((s) => ({ id: s.id, name: s.name, type: s.type }));
    }

    if (m.type === 'getCurrentPage') {
      const page = penpot.currentPage;
      result = page ? { id: page.id, name: page.name } : null;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    result = { error: message };
  }

  penpot.ui.sendMessage({ type: `${m.type}:result`, result });
});

penpot.on('themechange', (theme) => {
  penpot.ui.sendMessage({
    source: 'penpot',
    type: 'themechange',
    theme,
  });
});
