import { bot } from '../lib/plugins.js';
import { fancyText, flipText } from '../lib/font.js';
import { convertToOpus, flipMedia, toBlackVideo, toSticker } from '../lib/tools.js';

bot(
   {
      pattern: 'sticker',
      isPublic: true,
      desc: 'Converts Images/Video to Sticker',
      type: 'converter',
   },
   async (message) => {
      const media = message.reply_message?.video || message.reply_message?.image;
      if (!media) return message.sendReply('_Reply with an Image or Video!_');
      const msg = await message.downloadAndSaveMedia();
      const stickerBuffer = await toSticker(msg);
      await message.send(stickerBuffer, { type: 'sticker' });
   }
);

bot(
   {
      pattern: 'take',
      isPublic: true,
      desc: 'Resends Sticker As Own',
      type: 'converter',
   },
   async (message) => {
      if (!message.reply_message?.sticker) return message.sendReply('_Reply Sticker_');
      const msg = await message.downloadAndSaveMedia();
      const buff = await toSticker(msg);
      return await message.send(buff, { type: 'sticker' });
   }
);

bot(
   {
      pattern: 'rotate',
      isPublic: true,
      desc: 'Rotates Media to a particular direction',
      type: 'converter',
   },
   async (message, match) => {
      if (!message.reply_message?.image && !message.reply_message?.video) return message.sendReply('_Reply to an Image or Video_');
      const options = ['left', 'right', 'vertical', 'horizontal'];
      if (!options.includes(match)) return message.sendReply('_Choose a valid option:_ ' + message.prefix + 'flip left, right, vertical, or horizontal');
      const buff = await message.downloadAndSaveMedia();
      const flippedMedia = await flipMedia(buff, match);
      return await message.send(flippedMedia, { caption: '_Flipped successfully_' });
   }
);

bot(
   {
      pattern: 'black',
      isPublic: true,
      desc: 'Converts Audio to Black Video',
      type: 'converter',
   },
   async (message) => {
      if (!message.reply_message?.audio) return message.sendReply('_Reply An Audio_');
      const buff = await message.downloadAndSaveMedia();
      const res = await toBlackVideo(buff);
      return await message.send(res);
   }
);

bot(
   {
      pattern: 'fliptext',
      isPublic: true,
      desc: 'Revserse text order',
      type: 'converter',
   },
   async (message, match) => {
      const text = match || message.reply_message?.text;
      if (!text) return message.sendReply('_I need text_');
      const flipedtext = flipText(text);
      return message.sendReply(flipedtext);
   }
);

bot(
   {
      pattern: 'ppt',
      isPublic: true,
      desc: 'Converts Audio to PPT',
      type: 'converter',
   },
   async (message) => {
      if (!message.reply_message?.audio) return message.sendReply('_Reply An Audio_');
      const media = await message.downloadAndSaveMedia();
      const buff = await convertToOpus(media);
      return await message.send(buff);
   }
);

bot(
   {
      pattern: 'fancy',
      isPublic: true,
      desc: 'Converts text to Fancy Text',
      type: 'converter',
   },
   async (message, match, { prefix }) => {
      const input = match.split(';');
      const text = input[0]?.trim();
      const styleOption = input[1] ? parseInt(input[1].trim(), 10) : null;

      if (!text) return await message.sendReply(`\`\`\`FANCY TEXT MAKER\n\n${prefix}fancy astro\n\n${prefix}fancy astro;8\`\`\``);

      const fancyOutput = await fancyText(text, styleOption);
      await message.sendReply(fancyOutput);
   }
);
