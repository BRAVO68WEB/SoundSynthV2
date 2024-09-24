import mongoose from 'mongoose';

const audioSchema = new mongoose.Schema(
	{
		auth0_id: {
            type: String,
			required: true,
		},
        file_name: {
			type: String,
			required: true,
		},
        file_size: {
			type: Number,
			required: true,
		},
        file_type: {
			type: String,
			required: true,
		},
        s3_url: {
			type: String,
			required: true,
		}
	},
	{
		timestamps: true,
	}
);

audioSchema.index({ auth0_id: 1, createdAt: -1 });

audioSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

const Audio = mongoose.model('Audio', audioSchema);

export default Audio;