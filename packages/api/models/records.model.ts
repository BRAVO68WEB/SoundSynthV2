import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
	{
		auth0_id: {
            type: String,
			required: true,
		},
        title: {
			type: String,
			required: true,
		},
		audio_id: {
            ref: 'Audio',
            type: mongoose.Schema.Types.ObjectId,
            required: true,
		},
		transcription: {
			type: String,
			required: true,
		},
		summary: {
			type: String,
			required: true,
		},
        is_public: {
			type: Boolean,
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

recordSchema.index({ auth0_id: 1, createdAt: -1 });

recordSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

const Record = mongoose.model('Record', recordSchema);

export default Record;