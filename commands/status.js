const axios = require('axios');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Verifica o status de algum site.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL do site')
                .setRequired(true)),


    async execute(interaction) {
        const url = interaction.options.getString('url');
        const status = await checkStatus(url);
        const embed = new EmbedBuilder()
            .setTitle(`Status do site: ${url}`)
            .setColor(status.status === 'online' ? '#00FF00' : '#FF0000')
            .setDescription(status.status === 'online' ? `O site está online com tempo de resposta de ${status.ping.toFixed(2)}ms! (Código gerado: ${status.statusCode})` : `Site está ${status.status} ou não existe! (Código do erro gerado: ${status.statusCode})`)
            .setTimestamp()
        await interaction.reply({ embeds: [embed] });
    }

};

async function checkStatus(url) {
    let statusCode;
    try {
        const response = await axios.get(url);
        statusCode = response.status;
        const start = performance.now();
        const end = performance.now();
        const ping = end - start;
        return {
            statusCode: statusCode,
            status: 'online',
            ping: ping
        };
    } catch (error) {
        const statusCode = error.response ? error.response.status : 'unknown'
        return {
            statusCode: statusCode,
            status: 'offline',
            ping: null
        }
    };
}
