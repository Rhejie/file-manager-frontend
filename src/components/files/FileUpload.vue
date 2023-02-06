<template>
	<div class="h-full">
		<FilePond
			name="file"
			ref="pond"
			:instant-upload="true"
			:allow-revert="true"
			label-idle="Drop files here..."
			v-bind:allow-multiple="true"
			:server="option"
		/>
	</div>
</template>
<script>
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

import { defineComponent, ref, computed ,inject} from "vue";
import { store } from "@/composables/signedUrl";
import { http } from "@/composables/http_service";
import { useEmitter } from "@/composables/useEmitter";

export default defineComponent({
	name: "FileUpload",
	components: {
		FilePond: vueFilePond(),
	},
	props: {
		folder_id: null,
	},
	setup(props) {
		const auth = inject("auth");
		const emitter = useEmitter;
		const myFiles = ref(["cat.jpeg"]);

		const folder_id = computed(() => props.folder_id);
		const option = ref({
			url: "/api",
			process: (fieldName, file, metadata, load, error, progress, abort) => {
				uploadFile(file, metadata, load, error, progress, abort);
			},
			revert: {
				url: "/file-manager/file/undo",
				method: "POST",
				headers: {
					Authorization: "Bearer " + auth.token(),
					"content-type": "application/json",
				},
				ondata: (formData) => {
					return formData;
				},
				onload: (response) => {
					emitter.emit("UNDO_FILE", JSON.parse(response));
				},
			},
		});

		const uploadFile = async (file, metadata, load, error,abort) => {
			const response = await store(file)
			const formData = new FormData();

			formData.set("folder", "filemanager");
			formData.set("folder_id", folder_id?.value);
			formData.set("basename", response?.key);
			formData.set("filename", file?.name);
			formData.set("mimetype", file?.type.split("/")[1]);
			formData.set("filesize", file?.size);
			formData.set("url", response?.key);

			const result = await http().post("/file-manager/file/upload", formData)

			emitter.emit("NEW_FILE", result?.data);

			load(JSON.stringify(result?.data))

			
            return {
                abort: () => {
                    abort();
                }
            }				
		};

		const handleFilePondInit = () => {
			console.log("FilePond has initialized");
		};

		return {
			myFiles,
			handleFilePondInit,
			option,
		};
	},
});
</script>